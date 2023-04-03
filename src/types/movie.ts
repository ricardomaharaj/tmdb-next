export interface Movie {
    adult?:                 boolean;
    backdrop_path?:         string;
    budget?:                number;
    genres?:                Genre[];
    homepage?:              string;
    id:                     number;
    imdb_id?:               string;
    original_language?:     string;
    original_title?:        string;
    overview?:              string;
    popularity?:            number;
    poster_path?:           string;
    production_companies?:  ProductionCompany[];
    production_countries?:  ProductionCountry[];
    release_date?:          string;
    revenue?:               number;
    runtime?:               number;
    spoken_languages?:      SpokenLanguage[];
    status?:                string;
    tagline?:               string;
    title?:                 string;
    video?:                 boolean;
    vote_average?:          number;
    vote_count?:            number;
}

interface Genre {
    id?:   number;
    name?: string;
}

interface ProductionCompany {
    id?:             number;
    logo_path?:      string;
    name?:           string;
    origin_country?: string;
}

interface ProductionCountry {
    iso_3166_1?: string;
    name?:       string;
}

interface SpokenLanguage {
    english_name?: string;
    iso_639_1?:    string;
    name?:         string;
}

export interface MovieCredits {
    id?:   number;
    cast?: Cast[];
    crew?: Crew[];
}

interface Cast {
    adult?:                boolean;
    gender?:               number;
    id?:                   number;
    known_for_department?: string;
    name?:                 string;
    original_name?:        string;
    popularity?:           number;
    profile_path?:         null | string;
    cast_id?:              number;
    character?:            string;
    credit_id?:            string;
    order?:                number;
}

interface Crew {
    adult?:                boolean;
    gender?:               number;
    id?:                   number;
    known_for_department?: string;
    name?:                 string;
    original_name?:        string;
    popularity?:           number;
    profile_path?:         null | string;
    credit_id?:            string;
    department?:           string;
    job?:                  string;
}
