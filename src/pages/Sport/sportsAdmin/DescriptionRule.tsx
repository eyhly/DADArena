import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Sport } from "../../../types/sport";

interface DescriptionModalProps {
  open: boolean;
  handleClose: () => void;
  sport: Sport | null;
}

const DescriptionRule: React.FC<DescriptionModalProps> = ({
  open,
  handleClose,
  sport,
}) => {
  const renderDescription = (description: string | undefined) => {
    if (!description) return "Description Not Found";

  //format for deskripsi sport 
    const lines = description.split("\n");
    return lines.map((line, index) => {
      const isNumberedList = /^\d+\.\s/.test(line);
      
      if (isNumberedList) {
        return (
          <List key={index} sx={{ padding: 0 }}>
            <ListItem sx={{ paddingLeft: 1 }}>
              <ListItemText
                primary={<Typography variant="body1">{line}</Typography>}
              />
            </ListItem>
          </List>
        );
      }

      return (
        <Typography
          key={index}
          variant="body1"
          sx={{ whiteSpace: "pre-line", marginBottom: 1 }}
        >
          {line}
        </Typography>
      );
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rule Sport {sport?.title}</DialogTitle>
      <DialogContent dividers>
        {renderDescription(sport?.description)}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DescriptionRule;
