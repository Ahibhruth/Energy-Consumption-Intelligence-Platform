/**
 * React Hooks for Databricks Data Loading
 * Handles loading, error, retry states
 */

import { useState, useEffect } from 'react';
import { queryDatabricks, queryDatabricksBatch } from '../services/databricksApi';

export function useDataLoader(sqlQuery) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await queryDatabricks(sqlQuery);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [sqlQuery]);

  return { data, loading, error };
}

export function useDataLoaderBatch(sqlQueries) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await queryDatabricksBatch(sqlQueries);
        if (isMounted) {
          setData(results);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(sqlQueries)]);

  return { data, loading, error };
}