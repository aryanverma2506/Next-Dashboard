import React from "react";
import { Modal, Fade, Button } from "@mui/material";

interface OverlayModalProps extends React.PropsWithChildren {
  isOpen: boolean;
  closeModal?: () => void;
  submitHandler?: (event: React.FormEvent) => void;
}

const OverlayModal: React.FC<OverlayModalProps> = (props) => {
  const { isOpen, closeModal, submitHandler } = props;
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      closeAfterTransition
      className="h-screen py-24"
    >
      <Fade in={isOpen}>
        <form
          className="bg-white mx-auto w-4/6 min-w-min h-[500px] p-4"
          onSubmit={submitHandler}
        >
          <div className="grid items-center h-[85%] overflow-y-auto mb-4 pt-2">
            {props.children}
          </div>
          <div className="flex justify-end gap-4 h-[10%]">
            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              onClick={closeModal}
            >
              Submit
            </Button>
          </div>
        </form>
      </Fade>
    </Modal>
  );
};

export default OverlayModal;
