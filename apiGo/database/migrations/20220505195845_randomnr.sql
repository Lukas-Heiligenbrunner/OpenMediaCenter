-- +goose Up
-- +goose StatementBegin
alter table settings
    add random_nr int default  3 null;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table settings
    drop random_nr;
-- +goose StatementEnd
