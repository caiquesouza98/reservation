import { Button, Heading, Input } from "@chakra-ui/react";
import type { Route } from "./+types/newReservations";
import { Form, useNavigate } from "react-router"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Event Reservation App" },
    { name: "description", content: "Welcome to Event Reservation App!" },
  ];
}

export default function RoomReservation() {
  return (
    <Form method="post">
      <main>
        <Heading>Reserve uma sala</Heading>
        <div>
          <Input width={"sm"} color={"black"} backgroundColor={"white"} type="text" name="room" placeholder="Digite a sala a ser reservada"/>
        </div>
        <div>
          <Input width={"sm"} color={"black"} backgroundColor={"white"} type="text" name="user" placeholder="Digite seu usuário"/>
        </div>
        <div>
          <label>Data de inicio</label>
          <Input width={"sm"} color={"black"} backgroundColor={"white"} type="date" name="startDate"/>
        </div>
        <div>
          <label>Data do fim</label>
          <Input width={"sm"} color={"black"} backgroundColor={"white"} type="date" name="endDate"/>
        </div>
        <Button type="submit">Reservar</Button>
      </main>
    </Form>
  )
}