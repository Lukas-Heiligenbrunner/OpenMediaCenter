-- +goose Up
-- +goose StatementBegin
alter table videos
    add previewratio FLOAT default  -1.0 null;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table videos
    drop previewratio;
-- +goose StatementEnd
