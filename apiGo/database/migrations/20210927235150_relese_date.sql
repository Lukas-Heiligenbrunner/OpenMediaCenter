-- +goose Up
-- +goose StatementBegin
alter table videos
    add release_date date null;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table videos
    drop release_date;
-- +goose StatementEnd
