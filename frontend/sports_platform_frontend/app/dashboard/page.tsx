"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Organizer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/tournaments">
          <Card className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <CardHeader>
              <CardTitle>Tournaments</CardTitle>
              <CardDescription>Manage your tournaments</CardDescription>
            </CardHeader>
            <CardContent>
              <p>View, create, edit, and delete tournaments.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/teams">
          <Card className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <CardHeader>
              <CardTitle>Teams</CardTitle>
              <CardDescription>Manage your teams</CardDescription>
            </CardHeader>
            <CardContent>
              <p>View and manage your teams.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/requests">
          <Card className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <CardHeader>
              <CardTitle>Join Requests</CardTitle>
              <CardDescription>Manage join requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Approve or deny requests to join your teams.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
