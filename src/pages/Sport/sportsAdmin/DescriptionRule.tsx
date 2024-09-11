import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
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
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Rule Sport {sport?.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{sport?.description}</Typography>
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
