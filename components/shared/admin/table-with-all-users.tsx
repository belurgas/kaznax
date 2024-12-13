'use client';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface User {
    telegramId: string;  // Замените тип, если необходимо
    username: string;
    fullName: string;
  }

export async function UsersTable() {
    const response = await fetch("/api/getAllUsers", {
        method: "POST",
    })

    const data: User[] = await response.json()

    return (
        <Table>
        <TableCaption>Список всех пользователей</TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">TelegramId</TableHead>
            <TableHead>Username</TableHead>
            <TableHead className="text-right">Full Name</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((user) => (
                <TableRow key={user.telegramId}>
                    <TableCell className="font-medium">{user.telegramId}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell className="text-right">{user.fullName}</TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>

    )
}