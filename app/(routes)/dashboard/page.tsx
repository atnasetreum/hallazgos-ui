import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import {
  AccidentRateIndicator,
  EvidencePerMonthChart,
  HeatMapChart,
  MainTypesChart,
  ProductivityChart,
  StatusChart,
  TopUsersByPlantChart,
  ZonesChart,
} from "./_components";
//import { PyramidChart } from "./_components/PyramidChart";

export default function DashboardPage() {
  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={12} md={6} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AccidentRateIndicator />
        </Paper>
      </Grid> */}
      <Grid item xs={12} md={6} lg={3}>
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
          <ProductivityChart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
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
      <Grid item xs={12} md={6} lg={4}>
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
      {/* <Grid item xs={12} md={6} lg={8}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <HeatMapChart />
        </Paper>
      </Grid> */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <EvidencePerMonthChart projections={true} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <EvidencePerMonthChart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <EvidencePerMonthChart year={2024} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TopUsersByPlantChart />
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
