import React from "react";
import { Provider, useSelector, useDispatch, useStore } from "react-redux";
import { store, setProfile, setItem, addItem, removeLast, setStep } from "../store/resumeSlice";
import "./../styles/App.css";

const STEPS = ["Profile Section", "Education Section", "Skills Sector", "Mini Project", "Social"];

// section -> fields + button ids
const LISTS = {
  education: {
    fields: [["courseName", "Course Name*"], ["completionYear", "Completion Year*"], ["college", "College/School*"], ["percentage", "Percentage*"]],
    add: "add_education", del: "delete", addLabel: "ADD EDUCATION", title: "Add your Education Details",
  },
  skills: {
    fields: [["skill", "Skill*"]],
    add: "add_skill", del: "delete_skill", addLabel: "ADD SKILL", title: "Add your Skills",
  },
  projects: {
    fields: [["projectName", "Project Name*"], ["techStack", "Tech Stack*"], ["description", "Description*"]],
    add: "add_project", del: "delete", addLabel: "ADD PROJECT", title: "Add your Projects",
  },
  social: {
    fields: [["Social", "Social Media Link*"]],
    add: "add_social", del: "delete_social", addLabel: "ADD SOCIAL", title: "Add your Social Links",
  },
};

const PROFILE_FIELDS = [["fname", "First Name*"], ["lname", "Last Name*"], ["phone", "Phone*"], ["address", "Address*"], ["url", "Image URL*"]];

function Profile() {
  const profile = useSelector((s) => s.profile);
  const dispatch = useDispatch();
  return (
    <div className="card">
      <h4>Add your Profile Details</h4>
      {PROFILE_FIELDS.map(([name, label]) => (
        <input key={name} name={name} placeholder={label} value={profile[name]}
          onChange={(e) => dispatch(setProfile({ name, value: e.target.value }))} />
      ))}
    </div>
  );
}

function ListSection({ section }) {
  const rows = useSelector((s) => s[section]);
  const dispatch = useDispatch();
  const cfg = LISTS[section];
  return (
    <div className="card">
      <h4>{cfg.title}</h4>
      {rows.map((row, index) => (
        <div className="row" key={index}>
          {cfg.fields.map(([name, label]) => (
            <input key={name} name={name} placeholder={label} value={row[name]}
              onChange={(e) => dispatch(setItem({ section, index, name, value: e.target.value }))} />
          ))}
        </div>
      ))}
      <div className="actions">
        <button id={cfg.del} onClick={() => dispatch(removeLast(section))}>DELETE</button>
        <button id={cfg.add} onClick={() => dispatch(addItem(section))}>{cfg.addLabel}</button>
      </div>
    </div>
  );
}

function ResumeOutput() {
  const { profile, education, skills, projects, social } = useSelector((s) => s);
  return (
    <div className="card resume">
      {profile.url && <img src={profile.url} alt="profile" width="100" />}
      <h2>{profile.fname} {profile.lname}</h2>
      <p>{profile.phone} | {profile.address}</p>
      <h3>Education</h3>
      {education.map((e, i) => <p key={i}>{e.courseName} - {e.college} ({e.completionYear}) {e.percentage}%</p>)}
      <h3>Skills</h3>
      <p>{skills.map((s) => s.skill).filter(Boolean).join(", ")}</p>
      <h3>Projects</h3>
      {projects.map((p, i) => <p key={i}><b>{p.projectName}</b> [{p.techStack}] {p.description}</p>)}
      <h3>Social</h3>
      {social.map((s, i) => <p key={i}>{s.Social}</p>)}
    </div>
  );
}

function Nav() {
  const step = useSelector((s) => s.step);
  const dispatch = useDispatch();
  const store = useStore();
  const last = STEPS.length; // index 5 = final resume
  const go = (n) => dispatch(setStep(Math.max(0, Math.min(last, n))));
  const save = () => {
    localStorage.setItem("resume", JSON.stringify(store.getState()));
    go(step + 1);
  };
  return (
    <div className="nav">
      <button id="back" onClick={() => go(step - 1)}>BACK</button>
      {step < last && <button id="next" onClick={() => go(step + 1)}>NEXT</button>}
      {step < last && <button id="save_continue" onClick={save}>SAVE AND CONTINUE</button>}
    </div>
  );
}

function Body() {
  const step = useSelector((s) => s.step);
  const order = [null, "education", "skills", "projects", "social"];
  return (
    <div>
      <div className="header">RESUME GENERATOR</div>
      {step < STEPS.length && (
        <div className="stepper">
          {STEPS.map((t, i) => <span key={t} className={i === step ? "on" : ""}>{i + 1}. {t}</span>)}
        </div>
      )}
      {step === 0 && <Profile />}
      {step > 0 && step < 5 && <ListSection section={order[step]} />}
      {step === 5 && <ResumeOutput />}
      <Nav />
    </div>
  );
}

const App = () => (
  <Provider store={store}>
    <div>
      {/* Do not remove the main div */}
      <Body />
    </div>
  </Provider>
);

export default App;