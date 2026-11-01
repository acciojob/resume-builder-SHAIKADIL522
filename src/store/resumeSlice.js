import { createSlice, configureStore } from "@reduxjs/toolkit";

export const blank = {
  education: { courseName: "", completionYear: "", college: "", percentage: "" },
  skills: { skill: "" },
  projects: { projectName: "", techStack: "", description: "" },
  social: { Social: "" },
};

let saved = null;
try { saved = JSON.parse(localStorage.getItem("resume")); } catch (e) {}

const initialState = {
  profile: { fname: "", lname: "", phone: "", address: "", url: "" },
  education: [{ ...blank.education }],
  skills: [{ ...blank.skills }],
  projects: [{ ...blank.projects }],
  social: [{ ...blank.social }],
  ...(saved || {}),
  step: 0,
};

const slice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setProfile: (s, { payload: { name, value } }) => { s.profile[name] = value; },
    setItem: (s, { payload: { section, index, name, value } }) => { s[section][index][name] = value; },
    addItem: (s, { payload }) => { s[payload].push({ ...blank[payload] }); },
    removeLast: (s, { payload }) => { if (s[payload].length > 1) s[payload].pop(); },
    setStep: (s, { payload }) => { s.step = payload; },
  },
});

export const { setProfile, setItem, addItem, removeLast, setStep } = slice.actions;
export const store = configureStore({ reducer: slice.reducer });