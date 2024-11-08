import React, { useState } from "react";
import { useGetProfile } from "../../services/queries";
import { useAuthState } from "../../hook/useAuth";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Container,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  AccountCircle,
  Email,
  Person,
  Group,
  People,
  Wc,
} from "@mui/icons-material";
import { useUpdateProfile } from "../../services/mutation";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Profile } from "../../types/profile";
import axios from "axios";
import Navbar from "../Navigation/Navbar";

const ProfilePage = () => {
  const { data } = useAuthState();
  const user = data?.user;
  const userId = user?.profile.sub;
  const { data: profile, isLoading, isError } = useGetProfile(userId!);
  const { mutate: updateProfile } = useUpdateProfile();
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<Profile>();
  const [isEditable, setIsEditable] = useState(false);

  const handleEdit = () => setIsEditable(!isEditable);
  const handleBack = () => {
    navigate(-1);
  };

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onSubmit = (data: Profile) => {
     updateProfile(
      { userId, data },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Profile updated successfully",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/profile/${user?.profile.sub}`);
            }
          });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)){
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data,
            confirmButtonText: "Ok",
          });
        }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4, ml: 95 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4, ml: 95 }}>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Failed to load profile data
        </Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4, ml: 95 }}>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          No profile data available
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ ml: 55 }}>
      <Navbar onOpenUserMenu={handleOpenUserMenu} anchorElUser={anchorElUser} onCloseUserMenu={handleCloseUserMenu}/>
      <Box sx={{ display: "flex", justifyContent: "left", gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleEdit}>
          {isEditable ? "Cancel Edit" : "Update Profile"}
        </Button>
      </Box>

      {!isEditable ? (
        <Box sx={{ padding: 4}}>
          <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, minHeight: 300}}>
            <Typography variant="h4" gutterBottom sx={{mt: 3, mb: 2, textAlign: 'center'}}>
              User Profile
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <AccountCircle sx={{ marginRight: 1 }} />
              User ID: {profile.user_Id}
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Email sx={{ marginRight: 1 }} />
              Email: {profile.email}
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Person sx={{ marginRight: 1 }} />
              Full Name: {profile.user_Metadata.fullname}
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Wc sx={{ marginRight: 1 }} />
              Gender: {profile.user_Metadata.gender}
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Group sx={{ marginRight: 1 }} />
              Roles: {profile.roles.join(", ")}
            </Typography>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
              <People sx={{ marginRight: 1 }} />
              Teams:{" "}
              {profile.teams.map((team, index) => (
                <span key={index}>
                  {team.team} in {team.event}
                  {index < profile.teams.length - 1 ? ", " : ""}
                </span>
              ))}
            </Typography>
          </Paper>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={3} sx={{maxWidth: 600}}>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue={profile.email}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email *"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Email sx={{ marginRight: 1 }} />,
                      readOnly: true,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="fullname"
                control={control}
                defaultValue={profile.user_Metadata.fullname}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name *"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Person sx={{ marginRight: 1 }} />,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="gender"
                control={control}
                defaultValue={profile.user_Metadata.gender || ''} 
                render={({ field }) => (
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="gender-select-label">Gender *</InputLabel>
                    <Select
                      {...field}
                      labelId="gender-select-label"
                      label="Gender *"
                      startAdornment={<Person sx={{ marginRight: 1 }} />} 
                    >
                      <MenuItem value="">
                        <em>Select Gender</em>
                      </MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Submit Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;
