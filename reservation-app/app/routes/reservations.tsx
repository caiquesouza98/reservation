import { Form } from "react-router"
import type { Route } from "./+types/newReservations";
import { Box, Container, Heading, Spinner, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { deleteReserva, getReservas } from "@/api/reservations";
import { toaster } from "@/components/ui/toaster";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Event Reservation App" },
    { name: "description", content: "Welcome to Event Reservation App!" },
  ];
}

interface Reserva {
  id: number;
  roomId: number;
  userId: number;
  startDate: string;
  endDate: string;
}

export default function Home() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false)

  async function loadReservas() {
    try {
      setLoading(true)
      const data:any = await getReservas()
      setReservas(data.data || [])
    } catch(e) {
      toaster.create({description: "Erro ao carregar as reservas", type: "error"})
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteReserva(id: number) {
    try {
      await deleteReserva(id)
      toaster.create({description: "Reserva cancelada com sucesso", type: "success"})
      setReservas((prev) => prev.filter((reserva) => reserva.id !== id))
    } catch(e) {
      toaster.create({description: "Erro ao cancelar a reserva", type: "error"})
    }
  }

  useEffect(() => {
    loadReservas()
  }, [])

  return (
    <Container centerContent py={10}>
      <Heading mb={6}>Minhas reservas</Heading>
      {loading ? (
        <Spinner />
      ) : reservas.length === 0 ? (
        <Box>Nenhuma reserva encontrada.</Box>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Sala</Table.ColumnHeader>
              <Table.ColumnHeader>Usuário</Table.ColumnHeader>
              <Table.ColumnHeader>Inicio</Table.ColumnHeader>
              <Table.ColumnHeader>Fim</Table.ColumnHeader>
              <Table.ColumnHeader>Ações</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {reservas.map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell>{r.roomId}</Table.Cell>
                <Table.Cell>{r.userId}</Table.Cell>
                <Table.Cell>{new Date(r.startDate).toLocaleString()}</Table.Cell>
                <Table.Cell>{new Date(r.endDate).toLocaleString()}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )
    }
    </Container>
  );
}