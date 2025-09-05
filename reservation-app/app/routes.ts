import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  layout("routes/protected.tsx", [
    route("reservas", "routes/reservations.tsx", [
      route("criar", "routes/newReservations.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
