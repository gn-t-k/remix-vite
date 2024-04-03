import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { todos as todosSchema } from "database/tables/todos";
import { drizzle } from "drizzle-orm/d1";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const db = drizzle(context.cloudflare.env.DB);
  const todos = await db.select().from(todosSchema).all();

  return json({ todos });
};

export default function Index() {
  const { todos } = useLoaderData<typeof loader>();

  return (
    <section style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <Form method="POST">
        <label>
          title
          <input name="value" type="text" />
        </label>
        <button type="submit">submit</button>
      </Form>
    </section>
  );
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const value = formData.get("value");

    if (typeof value !== "string" || value.trim() === "") {
      return json({ result: "error: no value provided" });
    }

    const db = drizzle(context.cloudflare.env.DB);
    await db.insert(todosSchema).values({ title: value }).execute();

    return json({ result: "success" });
  } catch (error) {
    return json({
      result: `error: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    });
  }
};
