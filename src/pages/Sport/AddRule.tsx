import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import TextField from '@mui/material/TextField';
import { useCreateRule } from "../../services/mutation";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useSportDetails } from "../../services/queries";

interface AddRuleProps {
  open: boolean;
  handleClose: () => void;
  sportId: string;
}

const AddRule: React.FC<AddRuleProps> = ({ open, handleClose, sportId }) => {
  const [minPlayer, setMinPlayer] = useState<number | ''>('');
  const [maxPlayer, setMaxPlayer] = useState<number | ''>('');
  const [minWomen, setMinWoman] = useState<number | ''>('');
  const createRuleMutation = useCreateRule();
  const queryClient = useQueryClient();
  const { data: sport, isLoading: sportLoading } = useSportDetails(sportId);

  const handleSubmit = () => {
    if (minPlayer === '' || maxPlayer === '' || minWomen === '') {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all fields.",
        confirmButtonText: "Ok",
      });
      return;
    }

    createRuleMutation.mutate(
      { minPlayer: Number(minPlayer), maxPlayer: Number(maxPlayer), minWomen: Number(minWomen), sportId },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Rule added successfully!",
            confirmButtonText: "Ok",
          });
          queryClient.invalidateQueries({ queryKey: ['rules'] });
          handleClose();
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: error instanceof Error ? error.message : "An unexpected error occurred.",
            confirmButtonText: "Ok",
          });
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {sportLoading ? (
          <CircularProgress size={24} />
        ) : (
          `Create Rule for ${sport?.title || 'Sport'}`
        )}
      </DialogTitle>
      <DialogContent>
        {sportLoading ? (
          <Typography variant="body1">Loading sport details...</Typography>
        ) : (
          <>
            <TextField
              autoFocus
              margin="dense"
              label="Min Player"
              type="number"
              fullWidth
              variant="outlined"
              value={minPlayer === '' ? '' : minPlayer}
              onChange={(e) => setMinPlayer(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <TextField
              margin="dense"
              label="Max Player"
              type="number"
              fullWidth
              variant="outlined"
              value={maxPlayer === '' ? '' : maxPlayer}
              onChange={(e) => setMaxPlayer(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <TextField
              margin="dense"
              label="Min Woman"
              type="number"
              fullWidth
              variant="outlined"
              value={minWomen === '' ? '' : minWomen}
              onChange={(e) => setMinWoman(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <TextField
              fullWidth
              value={sport?.title || ''}
              disabled
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRule;
