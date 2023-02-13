--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: covoiturage_user
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO covoiturage_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: covoiturage_user
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: insert_passenger_mapping(); Type: FUNCTION; Schema: public; Owner: covoiturage_user
--

CREATE FUNCTION public.insert_passenger_mapping() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO "PassengerMapping" ("usID")
    SELECT UNNEST("Trajet"."passagers") FROM "Trajet";
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.insert_passenger_mapping() OWNER TO covoiturage_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: GTrajet; Type: TABLE; Schema: public; Owner: covoiturage_user
--

CREATE TABLE public."GTrajet" (
    "gID" integer NOT NULL,
    frequence text NOT NULL,
    debut date NOT NULL,
    fin date NOT NULL
);


ALTER TABLE public."GTrajet" OWNER TO covoiturage_user;

--
-- Name: GTrajet_gID_seq1; Type: SEQUENCE; Schema: public; Owner: covoiturage_user
--

CREATE SEQUENCE public."GTrajet_gID_seq1"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."GTrajet_gID_seq1" OWNER TO covoiturage_user;

--
-- Name: GTrajet_gID_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: covoiturage_user
--

ALTER SEQUENCE public."GTrajet_gID_seq1" OWNED BY public."GTrajet"."gID";


--
-- Name: Notes; Type: TABLE; Schema: public; Owner: covoiturage_user
--

CREATE TABLE public."Notes" (
    note integer NOT NULL,
    "noteID" integer NOT NULL,
    "noterID" integer NOT NULL,
    "noteurID" integer NOT NULL,
    "trajetID" integer NOT NULL,
    commentaire text NOT NULL,
    date timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Notes" OWNER TO covoiturage_user;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: covoiturage_user
--

CREATE TABLE public."Notification" (
    "notificationID" integer NOT NULL,
    "usID" integer NOT NULL,
    "Content" text NOT NULL,
    "create" timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Notification" OWNER TO covoiturage_user;

--
-- Name: Notification_nID_seq; Type: SEQUENCE; Schema: public; Owner: covoiturage_user
--

ALTER TABLE public."Notification" ALTER COLUMN "notificationID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Notification_nID_seq"
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Passager; Type: TABLE; Schema: public; Owner: covoiturage_user
--

CREATE TABLE public."Passager" (
    id integer NOT NULL,
    "trajetID" integer NOT NULL,
    "passagerID" integer NOT NULL,
    status character(1) NOT NULL
);


ALTER TABLE public."Passager" OWNER TO covoiturage_user;

--
-- Name: Passager_id_seq; Type: SEQUENCE; Schema: public; Owner: covoiturage_user
--

CREATE SEQUENCE public."Passager_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Passager_id_seq" OWNER TO covoiturage_user;

--
-- Name: Passager_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: covoiturage_user
--

ALTER SEQUENCE public."Passager_id_seq" OWNED BY public."Passager".id;


--
-- Name: Trajet; Type: TABLE; Schema: public; Owner: covoiturage_user
--

CREATE TABLE public."Trajet" (
    "trajetID" integer NOT NULL,
    depart text NOT NULL,
    destination text NOT NULL,
    "departLat" double precision NOT NULL,
    "departLon" double precision NOT NULL,
    "destinationLat" double precision NOT NULL,
    "destinationLon" double precision NOT NULL,
    "departHeure" timestamp with time zone NOT NULL,
    "arriverHeure" timestamp with time zone NOT NULL,
    date date NOT NULL,
    conducteur integer NOT NULL,
    "placeDisponible" smallint DEFAULT 4,
    "voitureID" integer,
    created_at timestamp with time zone DEFAULT now(),
    "GroupeTrajet" integer
);


ALTER TABLE public."Trajet" OWNER TO covoiturage_user;

--
-- Name: Trajet_tid_seq; Type: SEQUENCE; Schema: public; Owner: covoiturage_user
--

ALTER TABLE public."Trajet" ALTER COLUMN "trajetID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Trajet_tid_seq"
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Users; Type: TABLE; Schema: public; Owner: covoiturage_user
--

CREATE TABLE public."Users" (
    "usId" integer NOT NULL,
    login text NOT NULL,
    mdp bytea NOT NULL,
    nom text NOT NULL,
    prenom text NOT NULL,
    sexe character(1),
    mail text NOT NULL,
    telephone integer NOT NULL,
    biographie text,
    inscrit timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Users" OWNER TO covoiturage_user;

--
-- Name: Users_usId_seq; Type: SEQUENCE; Schema: public; Owner: covoiturage_user
--

CREATE SEQUENCE public."Users_usId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_usId_seq" OWNER TO covoiturage_user;

--
-- Name: Users_usId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: covoiturage_user
--

ALTER SEQUENCE public."Users_usId_seq" OWNED BY public."Users"."usId";


--
-- Name: voiture; Type: TABLE; Schema: public; Owner: covoiturage_user
--

CREATE TABLE public.voiture (
    "voitureID" integer NOT NULL,
    "proprietaireID" integer NOT NULL,
    marque text NOT NULL,
    modele text NOT NULL,
    place integer NOT NULL,
    couleur text NOT NULL
);


ALTER TABLE public.voiture OWNER TO covoiturage_user;

--
-- Name: voiture_voitureID_seq; Type: SEQUENCE; Schema: public; Owner: covoiturage_user
--

CREATE SEQUENCE public."voiture_voitureID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."voiture_voitureID_seq" OWNER TO covoiturage_user;

--
-- Name: voiture_voitureID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: covoiturage_user
--

ALTER SEQUENCE public."voiture_voitureID_seq" OWNED BY public.voiture."voitureID";


--
-- Name: Passager id; Type: DEFAULT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Passager" ALTER COLUMN id SET DEFAULT nextval('public."Passager_id_seq"'::regclass);


--
-- Name: Users usId; Type: DEFAULT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Users" ALTER COLUMN "usId" SET DEFAULT nextval('public."Users_usId_seq"'::regclass);


--
-- Name: voiture voitureID; Type: DEFAULT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public.voiture ALTER COLUMN "voitureID" SET DEFAULT nextval('public."voiture_voitureID_seq"'::regclass);


--
-- Name: GTrajet GTrajet_pkey1; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."GTrajet"
    ADD CONSTRAINT "GTrajet_pkey1" PRIMARY KEY ("gID");


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationID");


--
-- Name: Passager Passager_pkey; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Passager"
    ADD CONSTRAINT "Passager_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey1; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey1" PRIMARY KEY ("usId");


--
-- Name: Trajet arriver>depart; Type: CHECK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE public."Trajet"
    ADD CONSTRAINT "arriver>depart" CHECK (("arriverHeure" > "departHeure")) NOT VALID;


--
-- Name: Trajet date pas depasser; Type: CHECK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE public."Trajet"
    ADD CONSTRAINT "date pas depasser" CHECK ((date > now())) NOT VALID;


--
-- Name: Users login; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT login UNIQUE (login);


--
-- Name: Notes noteID; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT "noteID" PRIMARY KEY ("noteID");


--
-- Name: Trajet trajet_pkey; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Trajet"
    ADD CONSTRAINT trajet_pkey PRIMARY KEY ("trajetID");


--
-- Name: voiture voiture_pkey; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public.voiture
    ADD CONSTRAINT voiture_pkey PRIMARY KEY ("voitureID");


--
-- Name: index_name; Type: INDEX; Schema: public; Owner: covoiturage_user
--

CREATE INDEX index_name ON public."Notification" USING btree ("usID");


--
-- Name: Trajet update_passenger_mapping; Type: TRIGGER; Schema: public; Owner: covoiturage_user
--

CREATE TRIGGER update_passenger_mapping AFTER INSERT OR UPDATE ON public."Trajet" FOR EACH ROW EXECUTE FUNCTION public.insert_passenger_mapping();


--
-- Name: Trajet GID; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Trajet"
    ADD CONSTRAINT "GID" FOREIGN KEY ("GroupeTrajet") REFERENCES public."GTrajet"("gID") NOT VALID;


--
-- Name: Trajet conducteur; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Trajet"
    ADD CONSTRAINT conducteur FOREIGN KEY (conducteur) REFERENCES public."Users"("usId") NOT VALID;


--
-- Name: Notes noter; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT noter FOREIGN KEY ("noterID") REFERENCES public."Users"("usId") NOT VALID;


--
-- Name: Notes noteur; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT noteur FOREIGN KEY ("noteurID") REFERENCES public."Users"("usId") NOT VALID;


--
-- Name: Passager passager; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Passager"
    ADD CONSTRAINT passager FOREIGN KEY ("passagerID") REFERENCES public."Users"("usId");


--
-- Name: voiture proprietaire; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public.voiture
    ADD CONSTRAINT proprietaire FOREIGN KEY ("proprietaireID") REFERENCES public."Users"("usId");


--
-- Name: Notes trajet; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT trajet FOREIGN KEY ("trajetID") REFERENCES public."Trajet"("trajetID") NOT VALID;


--
-- Name: Passager trajet; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Passager"
    ADD CONSTRAINT trajet FOREIGN KEY ("trajetID") REFERENCES public."Trajet"("trajetID");


--
-- Name: Notification usID; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "usID" FOREIGN KEY ("usID") REFERENCES public."Users"("usId") NOT VALID;


--
-- Name: Trajet voiture; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Trajet"
    ADD CONSTRAINT voiture FOREIGN KEY ("voitureID") REFERENCES public.voiture("voitureID") NOT VALID;


--
-- PostgreSQL database dump complete
--

