import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useUpdateRule } from "../../services/mutation";
import { Rule } from "../../types/rule";
import Swal from "sweetalert2";

interface UpdateRuleProps {
  open: boolean;
  handleClose: () => void;
  rule: Rule;
}

const UpdateRule: React.FC<UpdateRuleProps> = ({ open, handleClose, rule }) => {
  const [minPlayer, setMinPlayer] = useState<number | ''>(rule.minPlayer ?? '');
  const [maxPlayer, setMaxPlayer] = useState<number | ''>(rule.maxPlayer ?? '');
  const [minWoman, setMinWoman] = useState<number | ''>(rule.minWomen ?? '');
  const [cusRule, setCusRule] = useState<string>(rule.cus_rule ?? '');

  const updateRuleMutation = useUpdateRule();

  // Reset form when the rule changes
  useEffect(() => {
    setMinPlayer(rule.minPlayer ?? '');
    setMaxPlayer(rule.maxPlayer ?? '');
    setMinWoman(rule.minWomen ?? '');
    setCusRule(rule.cus_rule ?? '');
  }, [rule]);

  const handleSubmit = () => {
    if (minPlayer === '' || maxPlayer === '' || minWoman === '' || cusRule.trim() === '') {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all fields.",
        confirmButtonText: "Ok",
      });
      return;
    }

    updateRuleMutation.mutate(
      {
        id: rule.id,
        minPlayer: Number(minPlayer),
        maxPlayer: Number(maxPlayer),
        minWomen: Number(minWoman),
        cus_rule: cusRule,
        sportId: rule.sportId,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Rule updated successsfully!",
            confirmButtonText: "Ok",
          });
          handleClose();
        },
        onError: (error: unknown) => {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: error instanceof Error ? error.message : "An unexpected error occurred.",
            confirmButtonText: "Ok",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Rule</DialogTitle>
      <DialogContent>
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
          value={minWoman === '' ? '' : minWoman}
          onChange={(e) => setMinWoman(e.target.value === '' ? '' : Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Custom Rule"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={cusRule}
          onChange={(e) => setCusRule(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={updateRuleMutation.isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={updateRuleMutation.isLoading}
          variant="contained"
          color="primary"
        >
          {updateRuleMutation.isLoading ? <CircularProgress size={24} /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateRule;
