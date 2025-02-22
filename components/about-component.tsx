"use client";

import Link from "next/link";

import styles from "../styles/Home.module.css";

export default function AboutComponent() {
  return (
    <>
      <h1>About Page</h1>
      <p className={styles.description}>
        <Link href="/">&larr; Go Back</Link>
      </p>
    </>
  );
}
