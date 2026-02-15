export type StoreType = "Enterprise" | "Company";

export type Weekday =
  | "Saturday"
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export interface IStoreSettings {
  name: string;
  address: string;
  prefix: string;
  contact_email: string;
  phone_number: string;
  logo: string;
  established_date: string;
  store_type: StoreType;
  website_url: string;
  founder: string | null;
  description: string;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  city: string;
  latitude: number | null;
  longitude: number | null;
  is_affiliated_store: boolean;
  trade_license: string | null;
  voter_id_card?: string | null;
  nid_verification?: string | null;
  tin_verification?: string | null;
  bin_verification?: string | null;
  voter_id_card_file?: string | null;
  nid_verification_file?: string | null;
  tin_verification_file?: string | null;
  bin_verification_file?: string | null;
  trade_license_file?: string | null;
  contract_paper: string | null;
  other_document: string | null;
  return_policy: string;
  tax_id: string;
  attendance_base_api_url: string | null;
  attendance_api_key: string | null;
  attendance_device_id: string | null;
  weekend_days: Weekday[];
}
