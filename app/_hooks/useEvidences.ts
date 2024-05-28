import { useState } from "react";

import { gql, useLazyQuery } from "@apollo/client";

import { FiltersEvidences } from "@routes/hallazgos/_components/FiltersEvidence";

const query = gql`
  query Evidences(
    $page: Int!
    $limit: Int!
    $manufacturingPlantId: Float
    $mainTypeId: Float
    $secondaryTypeId: Float
    $zoneId: Float
  ) {
    evidences(
      page: $page
      limit: $limit
      manufacturingPlantId: $manufacturingPlantId
      mainTypeId: $mainTypeId
      secondaryTypeId: $secondaryTypeId
      zoneId: $zoneId
    ) {
      count
      data {
        id
        status
        createdAt
        updatedAt
        solutionDate
        imgEvidence
        imgSolution
        manufacturingPlant {
          name
        }
        user {
          name
        }
        mainType {
          name
        }
        secondaryType {
          name
        }
        supervisors {
          id
          name
        }
        zone {
          name
        }
        comments {
          id
          comment
          user {
            name
          }
          createdAt
        }
        user {
          name
        }
      }
    }
  }
`;

interface ResponseEvidences {
  evidences: Evidences;
}

interface Evidences {
  count: number;
  data: EvidenceGraphql[];
}

export interface CommentEvidenceGraphql {
  id: number;
  comment: string;
  user: { name: string };
  createdAt: Date;
}

export interface EvidenceGraphql {
  id: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  solutionDate: Date | null;
  imgEvidence: string;
  imgSolution: string;
  manufacturingPlant: OnlyName;
  user: OnlyName;
  mainType: OnlyName;
  secondaryType: OnlyName;
  supervisors: { id: number; name: string }[];
  comments: CommentEvidenceGraphql[];
  zone: OnlyName;
}

interface OnlyName {
  name: string;
}

export const useEvidences = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getPageAndLimit = () => ({ page: page + 1, limit: rowsPerPage });

  const [findEvidences, { called, loading, data }] =
    useLazyQuery<ResponseEvidences>(query, {
      variables: { ...getPageAndLimit() },
    });

  const handleFindEvidences = (filters: FiltersEvidences) => {
    const variables = {
      ...(filters.manufacturingPlantId && {
        manufacturingPlantId: filters.manufacturingPlantId,
      }),
      ...(filters.mainTypeId && { mainTypeId: filters.mainTypeId }),
      ...(filters.secondaryType && {
        secondaryTypeId: filters.secondaryType,
      }),
      ...(filters.zone && { zoneId: filters.zone }),
    };

    return findEvidences({
      variables: { ...getPageAndLimit(), ...variables },
      fetchPolicy: "no-cache",
    });
  };

  return {
    findEvidences: handleFindEvidences,
    isCalled: called,
    isLoading: loading,
    evidences: data?.evidences.data || [],
    countEvidence: data?.evidences.count || 0,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  };
};
