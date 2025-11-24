import jwt
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

# Cache JWKS to avoid fetching on every request
JWKS = None

def get_jwks():
    global JWKS
    if JWKS is None:
        try:
            response = requests.get(settings.CLERK_JWKS_URL)
            response.raise_for_status()
            JWKS = response.json()
        except requests.exceptions.RequestException as e:
            raise AuthenticationFailed(f"Failed to fetch JWKS: {e}")
    return JWKS

class ClerkAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            token_type, jwt_token = auth_header.split(' ')
            if token_type.lower() != 'bearer':
                return None
        except ValueError:
            return None

        try:
            jwks = get_jwks()
            unverified_header = jwt.get_unverified_header(jwt_token)
            rsa_key = {}
            for key in jwks['keys']:
                if key['kid'] == unverified_header['kid']:
                    rsa_key = {
                        "kty": key['kty'],
                        "kid": key['kid'],
                        "use": key['use'],
                        "n": key['n'],
                        "e": key['e'],
                    }
            if not rsa_key:
                raise AuthenticationFailed('Unable to find appropriate key.')

            # Decode the token
            payload = jwt.decode(
                jwt_token,
                jwt.algorithms.RSAAlgorithm.from_jwk(rsa_key),
                algorithms=["RS256"],
                audience=settings.CLERK_JWT_AUDIENCE, # Audience of your Clerk JWT
                issuer=settings.CLERK_JWT_ISSUER,    # Issuer of your Clerk JWT
            )

            # Clerk user ID is typically in the 'sub' claim
            clerk_id = payload.get('sub')
            if not clerk_id:
                raise AuthenticationFailed('JWT has no "sub" claim.')

            # Find or create the Django user
            try:
                user = User.objects.get(clerk_id=clerk_id)
            except User.DoesNotExist:
                # If the user doesn't exist, create one.
                # You might want to get more user details from Clerk here if needed.
                user = User.objects.create_user(
                    username=clerk_id, # Or another unique identifier from payload
                    clerk_id=clerk_id,
                    # Set other fields as appropriate, e.g., email from payload.get('email')
                )
                user.save()

            return (user, jwt_token)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token.')
        except AuthenticationFailed as e:
            raise e
        except Exception as e:
            raise AuthenticationFailed(f'Authentication error: {e}')
