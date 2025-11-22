"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for tournaments
const tournaments = [
  { id: 1, name: "Summer Soccer Fest", sport: "Soccer", startDate: "2024-07-01", endDate: "2024-07-15" },
  { id: 2, name: "Basketball Pro League", sport: "Basketball", startDate: "2024-08-10", endDate: "2024-08-25" },
];

export default function TournamentsPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Tournaments</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Tournament</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new tournament</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new tournament.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sport" className="text-right">
                  Sport
                </Label>
                <Input id="sport" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input id="startDate" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input id="endDate" type="date" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setOpen(false)}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments.map((tournament) => (
            <TableRow key={tournament.id}>
              <TableCell>{tournament.name}</TableCell>
              <TableCell>{tournament.sport}</TableCell>
              <TableCell>{tournament.startDate}</TableCell>
              <TableCell>{tournament.endDate}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
