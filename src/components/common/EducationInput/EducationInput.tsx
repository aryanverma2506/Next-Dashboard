import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import { Education } from "@/interfaces/Education";

interface EducationInputProps extends React.PropsWithChildren {
  educations: Education[];
  setEducations: (...args: any) => void;
}

const EducationInput: React.FC<EducationInputProps> = (props) => {
  const { educations, setEducations } = props;

  const [duration, setDuration] = useState("");
  const [courseType, setCourseType] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [moreInfo, setMoreInfo] = useState("");

  const handleAddEducation = () => {
    if (duration && courseType && instituteName) {
      const newEducation: Education = {
        duration,
        courseType,
        instituteName,
        moreInfo,
      };
      setEducations([...educations, newEducation]);
      setDuration("");
      setCourseType("");
      setInstituteName("");
      setMoreInfo("");
    }
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducations = [...educations];
    updatedEducations.splice(index, 1);
    setEducations(updatedEducations);
  };

  return (
    <div>
      <Typography variant="h6" className="block max-w-full hyphens-auto">
        Education
      </Typography>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Institute Name"
            value={instituteName}
            onChange={(e) => setInstituteName(e.target.value)}
          />
          <TextField
            label="(Duration)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <TextField
            label="Course Type"
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
          />
          <TextField
            label="Other Information"
            value={moreInfo}
            onChange={(e) => setMoreInfo(e.target.value)}
          />
        </div>
        <Button
          variant="outlined"
          color="primary"
          className="w-full"
          onClick={handleAddEducation}
        >
          Add Education
        </Button>
      </div>
      <div className="grid gap-4 max-h-72 overflow-y-auto mt-4">
        {educations.map((education, index) => (
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
            <div className="flex flex-col gap-4">
              <Typography
                variant="body1"
                className="block max-w-full hyphens-auto"
              >
                <strong>Institute: </strong>
                {education.instituteName}
              </Typography>
              <div className="flex justify-between gap-4">
                <Typography
                  variant="body1"
                  className="block max-w-full hyphens-auto"
                >
                  <strong>Duration: </strong>
                  {education.duration}
                </Typography>
                <Typography
                  variant="body1"
                  className="block max-w-full hyphens-auto"
                >
                  <strong>Course Type: </strong>
                  {education.courseType}
                </Typography>
              </div>
              <Typography
                variant="body1"
                className="block max-w-full hyphens-auto"
              >
                <strong>More Info: </strong>
                <span>{education.moreInfo}</span>
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveEducation(index)}
            >
              Remove Education
            </Button>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default EducationInput;
