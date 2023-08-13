import React, { useState, useEffect, useRef } from "react";

// rrd imports
import { Form, useFetcher } from "react-router-dom";

// library
import { UserPlusIcon } from "@heroicons/react/24/solid";

// assets
import illustration from "../assets/illustration.jpg";

const SignupForm = () => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current.reset();
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  const userTypes = [
    { name: "SOSEC", id: 1 },
    { name: "IHAO", id: 2 },
    { name: "Chef", id: 3 },
    { name: "Purchasing", id: 4 },
    { name: "Kitchen", id: 5 },
    { name: "Inventory", id: 6 },
  ];

  return (
    <div className="intro">
      <div>
        <h1>
          User <span className="accent">Sign Up</span>
        </h1>
        <p>Signing up. Enter account details to continue.</p>
        <fetcher.Form method="post" ref={formRef}>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            aria-label="Email"
            autoComplete="given-name"
            ref={focusRef}
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your password"
            aria-label="Password"
          />
          <input
            type="text"
            name="username"
            required
            placeholder="Enter your first name or nickname"
            aria-label="Name"
            autoComplete="given-name"
          />
          <div className="grid-xs">
            <label>User Type</label>
            <select name="newUserType" id="newUserType" required>
              {userTypes
                .sort((a, b) => a.name - b.name)
                .map((usertype) => {
                  return (
                    <option key={usertype.id} value={usertype.name}>
                      {usertype.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <input type="hidden" name="_action" value="signUp" />
          <button
            type="submit"
            className="btn btn--dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Submitting…</span>
            ) : (
              <>
                <span>Create User</span>
                <UserPlusIcon width={20} />
              </>
            )}
          </button>
        </fetcher.Form>
      </div>
      <img src={illustration} alt="Kitchen" width={600} />
    </div>
  );
};
export default SignupForm;
