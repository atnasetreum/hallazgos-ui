import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { StatusChart } from "./_components/StatusChart";
import { ZonesChart } from "./_components/ZonesChart";
import { MainTypesChart } from "./_components/MainTypesChart";
//import { PyramidChart } from "./_components/PyramidChart";

export default function DashboardPage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <StatusChart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MainTypesChart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ZonesChart />
        </Paper>
      </Grid>
    </Grid>
  );
}

/*import { gql } from "@apollo/client";

import { getClient } from "@lib/apollo-client";

async function loadData() {
  const client = getClient();
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          results {
            id
            name
            image
          }
        }
      }
    `,
  });

  console.log({ data: data.characters.results });
}

export default async function LoginPage() {
  await loadData();
  return <p>hola mundo</p>;
}*/

/*
"use client";
import { gql } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useEffect } from "react";

const query = gql`
  query {
    characters(page: 1) {
      results {
        id
        name
        image
      }
    }
  }
`;

export interface Results {
  characters: Characters;
}

export interface Characters {
  __typename: string;
  results: Result[];
}

export interface Result {
  __typename: string;
  id: string;
  name: string;
  image: string;
}

export default function LoginPage() {
  const { data } = useSuspenseQuery<Results>(query);

  useEffect(() => {
    console.log({
      results: data.characters.results,
      data,
    });
  }, []);

  return <p>hola mundo</p>;
}*/
