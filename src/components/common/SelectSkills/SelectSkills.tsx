import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Chip } from "@mui/material";

interface TagSelectProps {
  readonly skills: string[];
  readonly skillOptions: string[];
  setSkills: (...args: any) => void;
}

const SelectSkills: React.FC<TagSelectProps> = (props) => {
  const { skills, skillOptions, setSkills } = props;

  return (
    <Autocomplete
      multiple
      value={skills}
      options={skillOptions}
      getOptionLabel={(option) => option}
      onChange={(event, newValue) => setSkills(newValue)}
      renderInput={(params) => <TextField {...params} label="Select Skills" />}
      renderOption={(props, option) => (
        <li {...props} key={option}>
          {option}
        </li>
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip {...getTagProps({ index })} key={option} label={option} />
        ))
      }
    />
  );
};

export default SelectSkills;
