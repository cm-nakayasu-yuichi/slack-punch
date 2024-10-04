import { FC, PropsWithChildren } from "hono/jsx";

const Layout = (props: PropsWithChildren<{}>) => {
  return (
    <html>
      <head>
        <title>デバッガー</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
};

export const Debugger = (props: { messages: any[] }) => {
  return (
    <Layout>
      <h3>件数: {props.messages.length}件</h3>
      <div style={{ display: "flex" }}>
        <div>
          {props.messages.map((message) => {
            return (
              <div>
                <p>
                  <b>{message.PostUserName}</b>:{message.Message}
                </p>
                <code>{JSON.stringify(message)}</code>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
