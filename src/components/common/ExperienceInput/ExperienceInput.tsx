import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import { Experience } from "@/interfaces/Experience";

interface ExperienceInputProps extends React.PropsWithChildren {
  experiences: Experience[];
  setExperiences: (...args: any) => void;
}

const ExperienceInput: React.FC<ExperienceInputProps> = (props) => {
  const { experiences, setExperiences } = props;
  const [duration, setDuration] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [jobRole, setJobRole] = useState("");

  const handleAddExperience = () => {
    if (duration && employmentType && organizationName && jobRole) {
      const newExperience: Experience = {
        duration,
        employmentType,
        organizationName,
        jobRole,
      };
      setExperiences([...experiences, newExperience]);
      setDuration("");
      setEmploymentType("");
      setOrganizationName("");
      setJobRole("");
    }
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  return (
    <div>
      <Typography
        variant="h6"
        className="block max-w-full hyphens-auto break-all sm:break-words"
      >
        Work Experience
      </Typography>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Years (Duration)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <TextField
            label="Employment Type"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          />
          <TextField
            label="Organization Name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
          />
          <TextField
            label="Job Role"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          />
        </div>
        <Button
          variant="outlined"
          color="primary"
          className="w-full"
          onClick={handleAddExperience}
        >
          Add Experience
        </Button>
      </div>
      <div className="grid gap-4 max-h-72 overflow-y-auto mt-4">
        {experiences.map((experience, index) => (
          <Box
            key={new Date().toISOString() + Math.random()}
            sx={{
              p: 2,
              m: 1,
              boxShadow: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "0.875rem",
              fontWeight: "700",
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Typography
                variant="body1"
                className="block max-w-full hyphens-auto break-all sm:break-words"
              >
                <strong>Duration: </strong>
                {experience.duration}
              </Typography>
              <Typography
                variant="body1"
                className="block max-w-full hyphens-auto break-all sm:break-words"
              >
                <strong>Employment Type: </strong>
                {experience.employmentType}
              </Typography>
              <Typography
                variant="body1"
                className="block max-w-full hyphens-auto break-all sm:break-words"
              >
                <strong>Organization: </strong>
                {experience.organizationName}
              </Typography>
              <Typography
                variant="body1"
                className="block max-w-full hyphens-auto break-all sm:break-words"
              >
                <strong>Job Role: </strong>
                {experience.jobRole}
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveExperience(index)}
            >
              Remove Experience
            </Button>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default ExperienceInput;
