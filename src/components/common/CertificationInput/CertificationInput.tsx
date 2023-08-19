import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface CertificationInputProps extends React.PropsWithChildren {
  readonly certifications: Record<string, string>;
  setCertifications: (...args: any) => void;
}

const CertificationInput: React.FC<CertificationInputProps> = (props) => {
  const { certifications, setCertifications } = props;
  const [certificationKey, setCertificationKey] = useState("");
  const [certificationValue, setCertificationValue] = useState("");

  const handleAddCertification = () => {
    if (certificationKey && certificationValue) {
      setCertifications(() => ({
        ...certifications,
        [certificationKey]: certificationValue,
      }));
      setCertificationKey(() => "");
      setCertificationValue(() => "");
    }
  };

  const handleRemoveCertification = (key: string) => {
    const updatedCertifications = { ...certifications };
    delete updatedCertifications[key];
    setCertifications(() => updatedCertifications);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Certification
      </Typography>
      <div className="flex flex-col gap-4 max-h-full">
        <div className="grid grid-cols-2 gap-4 w-full">
          <TextField
            label="Certification"
            value={certificationKey}
            onChange={(e) => setCertificationKey(e.target.value)}
          />
          <TextField
            label="About Certification"
            value={certificationValue}
            onChange={(e) => setCertificationValue(e.target.value)}
          />
        </div>
        <Button
          variant="outlined"
          color="primary"
          className="w-full"
          onClick={handleAddCertification}
        >
          Add
        </Button>
        <div className="flex flex-col gap-2 p-1 max-h-72 lg:max-h-20 overflow-y-auto">
          {Object.entries(certifications).map(([key, value]) => (
            <Box
              key={key}
              sx={{
                p: 1,
                m: 0,
                boxShadow: 3,
                borderRadius: 2,
                fontSize: "0.875rem",
                fontWeight: "700",
              }}
              className="flex justify-between items-center"
            >
              <Typography
                variant="body1"
                className="block max-w-full hyphens-auto break-all sm:break-words"
              >
                <strong>{key}: </strong>
                {value}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveCertification(key)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificationInput;
