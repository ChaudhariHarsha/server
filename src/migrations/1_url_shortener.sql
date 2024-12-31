CREATE TABLE IF NOT EXISTS core.url_shortener
(
    url_id integer NOT NULL DEFAULT nextval('core.url_shortener_url_id_seq'::regclass),
    original_url text NOT NULL,
    shorten_url text NOT NULL,
    count integer DEFAULT 0,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT url_shortener_pkey PRIMARY KEY (url_id),
    CONSTRAINT url_shortener_shorten_url_key UNIQUE (shorten_url)
)

CREATE INDEX idx_short_url ON core.url_shortener (shorten_url);
