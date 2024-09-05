import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { Reaction } from "./Reaction";

export interface ReactionData {
  src: string;
  count: number;
}

interface ReactionsProps {
  data: Array<ReactionData>;
}

export const Reactions = ({ data, ...props }: ReactionsProps) => {
  const Item = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  return (
    <Paper
      sx={{
        display: "flex",
        flexWrap: "wrap",
        listStyle: "none",
        backgroundColor: "transparent",
        padding: 0,
        margin: 0,
      }}
      elevation={0}
      square
      component="ul"
    >
      {data.map((datum) => {
        return (
          <Item>
            <Reaction src={datum.src} count={datum.count} />
          </Item>
        );
      })}
    </Paper>
  );
};
