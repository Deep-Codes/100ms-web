import React, { useState, useEffect } from "react";
import {
  Button,
  MessageModal,
  Text,
  useHMSActions,
} from "@100mslive/hms-video-react";
import { hmsToast } from "./notifications/hms-toast";

const defaultClasses = {
  formInner: "w-full flex flex-col md:flex-row my-1.5",
  selectLabel: "w-full md:w-1/3 flex justify-start md:justify-end items-center",
  selectContainer:
    "rounded-lg w-full md:w-1/2 bg-gray-600 dark:bg-gray-200 p-2 mx-0 my-2 md:my-0 md:mx-2",
  select:
    "rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none",
};

const ChangeNameForm = ({ currentName, setCurrentName, changeName }) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        changeName();
      }}
    >
      <div className={defaultClasses.formInner}>
        <div className={defaultClasses.selectLabel}>
          <Text variant="heading" size="sm">
            Name:
          </Text>
        </div>

        <div className={defaultClasses.selectContainer}>
          <input
            id="nameInput"
            type="text"
            className={defaultClasses.select}
            value={currentName}
            onChange={e => setCurrentName(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export const ChangeName = ({ showChangeNameModal, setShowChangeNameModal }) => {
  const hmsActions = useHMSActions();
  const [currentName, setCurrentName] = useState("");
  const changeName = async () => {
    try {
      await hmsActions.changeName(currentName);
    } catch (error) {
      console.error("failed to update name", error);
      hmsToast(error.message);
    } finally {
      setShowChangeNameModal(false);
      setCurrentName("");
    }
  };

  useEffect(() => {
    const nameInput = document.getElementById("nameInput");
    if (showChangeNameModal) {
      nameInput.focus();
    }
  }, [showChangeNameModal]);

  const resetState = () => {
    setShowChangeNameModal(false);
    setCurrentName("");
  };

  return (
    <MessageModal
      title="Change my name"
      body={
        <ChangeNameForm
          currentName={currentName}
          setCurrentName={setCurrentName}
          changeName={changeName}
        />
      }
      footer={
        <Button
          variant="emphasized"
          shape="rectangle"
          onClick={changeName}
          disabled={currentName.length < 1}
        >
          Change
        </Button>
      }
      show={showChangeNameModal}
      onClose={() => resetState()}
    />
  );
};
