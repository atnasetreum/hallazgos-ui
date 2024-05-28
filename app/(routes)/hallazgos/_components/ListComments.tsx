import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { stringToDateWithTime } from "@shared/utils";
import { CommentEvidenceGraphql } from "@hooks";

interface Props {
  comments: CommentEvidenceGraphql[];
}

export default function ListComments({ comments }: Props) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {comments.map((comment) => (
        <div key={comment.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src="https://png.monster/wp-content/uploads/2021/06/png.monster-9-370x370.png"
              />
            </ListItemAvatar>
            <ListItemText
              primary={comment.comment}
              secondary={
                <>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {comment.user.name}
                  </Typography>
                  {` — ${stringToDateWithTime(comment.createdAt)}`}
                </>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </div>
      ))}
    </List>
  );
}
