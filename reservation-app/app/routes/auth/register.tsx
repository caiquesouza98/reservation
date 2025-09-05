import { Button, Container, Field, Heading, Input, Text } from "@chakra-ui/react";
import type { Route } from "../+types/newReservations";
import { Form, Link, useNavigate } from "react-router"
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { login, register } from "@/api/auth";
import { toaster } from "@/components/ui/toaster";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Event Reservation App" },
    { name: "description", content: "Welcome to Event Reservation App!" },
  ];
}

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [visible, setVisible] = useState(false)

  async function handleRegistration() {
    try {
      await register(name, email, password)
      toaster.create({
        title: "Usuario cadastrado com sucesso",
        type: "success",
      })
      const user = await login(email, password)
      toaster.create({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.name}!`,
        type: "success",
      })
      navigate("/reservas")
    } catch (e) {
      toaster.create({
        description: "Erro ao realizar o cadastro",
        type: "error",
      })
    }
  }
  return (
    <Container borderRadius="md" borderColor="white" borderWidth="thin" centerContent my={40} flex={1} flexDir={"column"} gap={4} width="lg" p={10}>
        <Heading mb={6}>Cadastrar-se</Heading>
        <Form method="post">
        <div>
          <Field.Root required>
            <Field.Label>
              Nome
              <Field.RequiredIndicator />
            </Field.Label>
            <Input width={"sm"} color={"black"} backgroundColor={"white"} type="text" name="name" placeholder="Digite seu nome" value={name} onChange={(e) => setName(e.target.value)}/>
          </Field.Root>
        </div>
        <div>
          <Field.Root required>
            <Field.Label >
              Email
              <Field.RequiredIndicator />
            </Field.Label>
            <Input width={"sm"} color={"black"} backgroundColor={"white"} type="email" name="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </Field.Root>
        </div>
        <div>
          <Field.Root required>
            <Field.Label>
              Senha
              <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput width={"sm"} color={"black"} backgroundColor={"white"} visible={visible} onVisibleChange={setVisible} name="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </Field.Root>
        </div>
        <Button width={"sm"} type="submit" onClick={handleRegistration}>Criar conta</Button>
        <Link to="/"><Button width={"sm"} type="button">Entrar</Button></Link>
        </Form>
      </Container>
  )
}
