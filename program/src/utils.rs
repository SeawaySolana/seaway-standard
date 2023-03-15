use anchor_lang::prelude::*;
use chrono::{Duration, Months, NaiveDateTime};

pub fn get_creator_metadata_uri(base_uri: &str, creator: &Pubkey) -> String {
    format!("{}/{}/creator.json", base_uri, creator)
}

pub fn get_membership_metadata_uri(
    base_uri: &str,
    creator: &Pubkey,
    membership: &Pubkey,
    number: u64,
) -> String {
    format!("{}/{}/{}/{}.json", base_uri, creator, membership, number)
}

pub fn get_plus_months_expiration_timestamp(creation_timestamp: i64, duration: u16) -> i64 {
    let creation_date_time = NaiveDateTime::from_timestamp_opt(creation_timestamp, 0).unwrap();
    let (creation_date, creation_time) = (creation_date_time.date(), creation_date_time.time());
    let expiration_date = creation_date
        .checked_add_months(Months::new(duration.into()))
        .unwrap();
    (NaiveDateTime::new(expiration_date, creation_time)).timestamp()
}

pub fn get_plus_days_expiration_timestamp(creation_timestamp: i64, duration: i64) -> i64 {
    let creation_date_time = NaiveDateTime::from_timestamp_opt(creation_timestamp, 0).unwrap();
    let (creation_date, creation_time) = (creation_date_time.date(), creation_date_time.time());
    let expiration_date = creation_date
        .checked_add_signed(Duration::days(duration))
        .unwrap();
    (NaiveDateTime::new(expiration_date, creation_time)).timestamp()
}
