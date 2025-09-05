import { Form, Link, redirect, useActionData, useNavigate } from "react-router"
import type { Route } from "../+types/newReservations";
import { Button, Container, Field, Heading, Input } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { login } from "@/api/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Event Reservation App" },
    { name: "description", content: "Welcome to Event Reservation App!" },
  ];
}

export default function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/reservas");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <Container borderRadius="md" borderColor="white" borderWidth="thin" centerContent my={40} flex={1} flexDir={"column"} gap={4} width="lg" p={10}>
        <Heading mb={6}>Entrar</Heading>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form method="post" onSubmit={handleSubmit}>
        <div>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input width={"sm"} color={"black"} backgroundColor={"white"} type="email" name="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </Field.Root>
        </div>
        <div>
          <Field.Root>
            <Field.Label>Senha</Field.Label>
            <PasswordInput width={"sm"} color={"black"} backgroundColor={"white"} name="password" placeholder="Digite sua senha" visible={visible} onVisibleChange={setVisible} value={password} onChange={(e) => setPassword(e.target.value)}/>
          </Field.Root>
        </div>
        <Button width={"sm"} type="submit">Entrar</Button>
        <Link to="/register"><Button width={"sm"} type="button">Criar conta</Button></Link>
        </form>
    </Container>
  );
}