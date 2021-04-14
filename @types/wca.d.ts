type WCAEvent = 333 | 222 | 444 | 555 | 666 | 777 | "333oh" | "333fm" | clock | "333bf" | minx | pyram | skewb | sq1 | "444bf" | "555bf" | "333mbf"
type RemovedWCAEvent = "333ft" | mmagic | magic

//Person/User Interfaces
interface Teams {
    friendly_id: string,
    leader: boolean
}

interface PersonalRecords {
    single?: {
        best: number,
        world_rank: number,
        continent_rank: number,
        country_rank: number
    }
    average?: {
        best: number,
        world_rank: number,
        continent_rank: number,
        country_rank: number
    }
}

interface WCAUser {
    class: user,
    url: string,
    id: number,
    wca_id: string | null,
    name: string,
    gender: string | null,
    country_iso2: string,
    delegate_status: string | null,
    created_at: string,
    updated_at: string,
    teams: Teams[]|null[],
    avatar: {
        url: string,
        thumb_url: string,
        is_default: boolean
    },
    email?: string,
    region?: string,
    senior_delegate_id?: number
}

interface WCAPerson {
    wca_id: string,
    name: string,
    url: string,
    gender: string,
    country_iso2: string,
    delegate_status: string | null,
    teams: Teams[]|null[],
    avatar: {
        url: string,
        thumb_url: string,
        is_default: boolean
    },
    competition_count: number,
    personal_records: {[ key:WCAEvent | RemovedWCAEvent ]: PersonalRecords },
    medals: {
        gold: number,
        silver: number,
        bronze: number,
        total: number
    },
    records: {
        national: number,
        continental: number,
        world: number,
        total: number
    }
}

//Competition interface
interface WCACompetition {
    //catch error
    code?: string,
    //normal??
    class: string,
    url: string,
    id: string,
    name: string,
    website: string,
    short_name: string,
    city: string,
    venue_address: string,
    venue_details: string,
    latitude_degrees: number,
    longitude_degrees: number,
    country_iso2: string,
    start_date: string,
    registration_open: string,
    registration_close: string,
    announced_at: string,
    cancelled_at: string|null,
    end_date: string,
    delegates: WCAUser[]
    trainee_delegates: WCAUser[]|null[],
    organizers: WCAUser[]|null[]
    competitor_limit: number,
    event_ids: WCAEvent[]
  }

//Results interface
//Only defines one: actual result would be an array of these
interface WCAPersonResult {
    id: number,
    name: string,
    country_iso2: string,
    competition_id: string,
    pos: number,
    event_id: WCAEvent | RemovedWCAEvent,
    round_type_id: string,
    format_id: string,
    wca_id: string,
    attempts: number[],
    best: number,
    best_index: number,
    worst_index: number,
    average: number,
    regional_single_record: number | null,
    regional_average_record: number | null
}
