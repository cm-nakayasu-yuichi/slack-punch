import { PropsWithChildren } from "hono/jsx";
import { Message } from "./message/message.service";
import { Matome } from "./matome/matome.service";
import { User } from "./user/user.service";

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

export const Debugger = (props: {
  messages: Message[];
  matomes: Matome[];
  users: User[];
}) => {
  return (
    <Layout>
      <MessageList messages={props.messages} />;
      <MatomeList matomes={props.matomes} />;
      <UserList users={props.users} />
    </Layout>
  );
};

export const MessageList = (props: { messages: Message[] }) => {
  return (
    <>
      <h3>メッセージ。件数: {props.messages.length}件</h3>
      <div style={{ display: "flex" }}>
        <div>
          {props.messages.map((message) => {
            return (
              <div>
                <p>
                  <b>{message.postUserName}</b>:{message.message}
                </p>
                <code>{JSON.stringify(message)}</code>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const MatomeList = (props: { matomes: Matome[] }) => {
  return (
    <>
      <h3>まとめ。件数: {props.matomes.length}件</h3>
      <div style={{ display: "flex" }}>
        <div>
          {props.matomes.map((matome) => {
            return (
              <div>
                <h4>{matome.title}</h4>
                <p>{matome.description}</p>
                <ul>
                  {matome.messageIdList.map((message) => {
                    return (
                      <li>
                        <b>{message.split("/")[0]}</b>
                        {message.split("/")[1]}
                      </li>
                    );
                  })}
                </ul>
                <code>{JSON.stringify(matome)}</code>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
      <a href="/debug/createMatome">適当にまとめを作成する</a>
    </>
  );
};

export const UserList = (props: { users: User[] }) => {
  return (
    <>
      <h3>ユーザー。件数: {props.users.length}件</h3>
      <div style={{ display: "flex" }}>
        <div>
          {props.users.map((user) => {
            return (
              <div>
                <h4>{user.displayUserName}</h4>
                <p>{user.slackUserId}</p>
                <img src={user.userImage ?? ""} />
                <code>{JSON.stringify(user)}</code>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
