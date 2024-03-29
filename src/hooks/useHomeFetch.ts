import API, {Movie} from '../API';
import {isPersistedState} from '../helpers'
import {useEffect, useRef, useState} from "react";

const initalState = 
{
	page: 0,
	results: [] as Movie [],
	total_pages: 0,
	total_results: 0
}

export const useHomeFetch = () =>
{
	const [searchTerm, setSearchTerm] = useState ('');
	const [state, setState] = useState (initalState);
	const [loading, setLoading] = useState (false);
	const [error, setError] = useState (false);
	const [isLoadingMore, setIsLoadingMore] = useState (false);

	const fetchMovies = async (page: number, searchTerm: string = '') =>
	{
		try
		{
			setError (false);
			setLoading (true);
			const movies = await API.fetchMovies (searchTerm, page);
			setState (prev => ({...movies, results: page > 1 ? [...prev.results, ...movies.results] : [...movies.results]}));
		}
		catch (error)
		{
			setError (true);
		}
		setLoading (false);
	}

	useEffect (() =>
	{
		if (!searchTerm)
		{
			const sessionState = isPersistedState ('homeState');
			if (sessionState)
			{
				setState (sessionState);
				return;
			}
		}
		setState (initalState);
		fetchMovies (1, searchTerm);
	}, [searchTerm]); // Triggered when search term changes

	useEffect (() =>
	{
		if (isLoadingMore)
		{
			fetchMovies (state.page + 1, searchTerm);
			setIsLoadingMore (false);
		}
	}, [isLoadingMore, searchTerm, state.page]);

	useEffect (() =>
	{
		if (!searchTerm)
        {
			sessionStorage.setItem ('homeState', JSON.stringify (state));
		}
	}, [searchTerm, state]);

	return {setSearchTerm, searchTerm, state, loading, error, setIsLoadingMore};
}