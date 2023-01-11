--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

-- Started on 2023-01-11 01:06:36

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: covoiturage_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO covoiturage_user;

--
-- TOC entry 227 (class 1255 OID 16400)
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
-- TOC entry 222 (class 1259 OID 16528)
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
-- TOC entry 221 (class 1259 OID 16527)
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
-- TOC entry 3207 (class 0 OID 0)
-- Dependencies: 221
-- Name: GTrajet_gID_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: covoiturage_user
--

ALTER SEQUENCE public."GTrajet_gID_seq1" OWNED BY public."GTrajet"."gID";


--
-- TOC entry 214 (class 1259 OID 16407)
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
-- TOC entry 215 (class 1259 OID 16410)
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
-- TOC entry 216 (class 1259 OID 16415)
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
-- TOC entry 224 (class 1259 OID 16560)
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
-- TOC entry 223 (class 1259 OID 16559)
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
-- TOC entry 3208 (class 0 OID 0)
-- Dependencies: 223
-- Name: Passager_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: covoiturage_user
--

ALTER SEQUENCE public."Passager_id_seq" OWNED BY public."Passager".id;


--
-- TOC entry 217 (class 1259 OID 16423)
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
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Trajet" OWNER TO covoiturage_user;

--
-- TOC entry 218 (class 1259 OID 16428)
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
-- TOC entry 220 (class 1259 OID 16502)
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
-- TOC entry 219 (class 1259 OID 16501)
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
-- TOC entry 3209 (class 0 OID 0)
-- Dependencies: 219
-- Name: Users_usId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: covoiturage_user
--

ALTER SEQUENCE public."Users_usId_seq" OWNED BY public."Users"."usId";


--
-- TOC entry 226 (class 1259 OID 16578)
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
-- TOC entry 225 (class 1259 OID 16577)
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
-- TOC entry 3210 (class 0 OID 0)
-- Dependencies: 225
-- Name: voiture_voitureID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: covoiturage_user
--

ALTER SEQUENCE public."voiture_voitureID_seq" OWNED BY public.voiture."voitureID";


--
-- TOC entry 3028 (class 2604 OID 16563)
-- Name: Passager id; Type: DEFAULT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Passager" ALTER COLUMN id SET DEFAULT nextval('public."Passager_id_seq"'::regclass);


--
-- TOC entry 3026 (class 2604 OID 16505)
-- Name: Users usId; Type: DEFAULT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Users" ALTER COLUMN "usId" SET DEFAULT nextval('public."Users_usId_seq"'::regclass);


--
-- TOC entry 3029 (class 2604 OID 16581)
-- Name: voiture voitureID; Type: DEFAULT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public.voiture ALTER COLUMN "voitureID" SET DEFAULT nextval('public."voiture_voitureID_seq"'::regclass);


--
-- TOC entry 3044 (class 2606 OID 16535)
-- Name: GTrajet GTrajet_pkey1; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."GTrajet"
    ADD CONSTRAINT "GTrajet_pkey1" PRIMARY KEY ("gID");


--
-- TOC entry 3035 (class 2606 OID 16441)
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationID");


--
-- TOC entry 3046 (class 2606 OID 16565)
-- Name: Passager Passager_pkey; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Passager"
    ADD CONSTRAINT "Passager_pkey" PRIMARY KEY (id);


--
-- TOC entry 3040 (class 2606 OID 16509)
-- Name: Users Users_pkey1; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey1" PRIMARY KEY ("usId");


--
-- TOC entry 3030 (class 2606 OID 16542)
-- Name: Trajet arriver>depart; Type: CHECK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE public."Trajet"
    ADD CONSTRAINT "arriver>depart" CHECK (("arriverHeure" > "departHeure")) NOT VALID;


--
-- TOC entry 3031 (class 2606 OID 16543)
-- Name: Trajet date pas depasser; Type: CHECK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE public."Trajet"
    ADD CONSTRAINT "date pas depasser" CHECK ((date > now())) NOT VALID;


--
-- TOC entry 3042 (class 2606 OID 16511)
-- Name: Users login; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT login UNIQUE (login);


--
-- TOC entry 3033 (class 2606 OID 16485)
-- Name: Notes noteID; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT "noteID" PRIMARY KEY ("noteID");


--
-- TOC entry 3038 (class 2606 OID 16449)
-- Name: Trajet trajet_pkey; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Trajet"
    ADD CONSTRAINT trajet_pkey PRIMARY KEY ("trajetID");


--
-- TOC entry 3048 (class 2606 OID 16585)
-- Name: voiture voiture_pkey; Type: CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public.voiture
    ADD CONSTRAINT voiture_pkey PRIMARY KEY ("voitureID");


--
-- TOC entry 3036 (class 1259 OID 16450)
-- Name: index_name; Type: INDEX; Schema: public; Owner: covoiturage_user
--

CREATE INDEX index_name ON public."Notification" USING btree ("usID");


--
-- TOC entry 3059 (class 2620 OID 16451)
-- Name: Trajet update_passenger_mapping; Type: TRIGGER; Schema: public; Owner: covoiturage_user
--

CREATE TRIGGER update_passenger_mapping AFTER INSERT OR UPDATE ON public."Trajet" FOR EACH ROW EXECUTE FUNCTION public.insert_passenger_mapping();


--
-- TOC entry 3053 (class 2606 OID 16554)
-- Name: Trajet conducteur; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Trajet"
    ADD CONSTRAINT conducteur FOREIGN KEY (conducteur) REFERENCES public."Users"("usId") NOT VALID;


--
-- TOC entry 3055 (class 2606 OID 16549)
-- Name: GTrajet id; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."GTrajet"
    ADD CONSTRAINT id FOREIGN KEY ("gID") REFERENCES public."Trajet"("trajetID") NOT VALID;


--
-- TOC entry 3049 (class 2606 OID 16517)
-- Name: Notes noter; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT noter FOREIGN KEY ("noterID") REFERENCES public."Users"("usId") NOT VALID;


--
-- TOC entry 3050 (class 2606 OID 16522)
-- Name: Notes noteur; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT noteur FOREIGN KEY ("noteurID") REFERENCES public."Users"("usId") NOT VALID;


--
-- TOC entry 3056 (class 2606 OID 16571)
-- Name: Passager passager; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Passager"
    ADD CONSTRAINT passager FOREIGN KEY ("passagerID") REFERENCES public."Users"("usId");


--
-- TOC entry 3058 (class 2606 OID 16586)
-- Name: voiture proprietaire; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public.voiture
    ADD CONSTRAINT proprietaire FOREIGN KEY ("proprietaireID") REFERENCES public."Users"("usId");


--
-- TOC entry 3051 (class 2606 OID 16496)
-- Name: Notes trajet; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT trajet FOREIGN KEY ("trajetID") REFERENCES public."Trajet"("trajetID") NOT VALID;


--
-- TOC entry 3057 (class 2606 OID 16566)
-- Name: Passager trajet; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Passager"
    ADD CONSTRAINT trajet FOREIGN KEY ("trajetID") REFERENCES public."Trajet"("trajetID");


--
-- TOC entry 3052 (class 2606 OID 16512)
-- Name: Notification usID; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "usID" FOREIGN KEY ("usID") REFERENCES public."Users"("usId") NOT VALID;


--
-- TOC entry 3054 (class 2606 OID 16591)
-- Name: Trajet voiture; Type: FK CONSTRAINT; Schema: public; Owner: covoiturage_user
--

ALTER TABLE ONLY public."Trajet"
    ADD CONSTRAINT voiture FOREIGN KEY ("voitureID") REFERENCES public.voiture("voitureID") NOT VALID;


--
-- TOC entry 2066 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES  TO covoiturage_user;


--
-- TOC entry 2068 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES  TO covoiturage_user;


--
-- TOC entry 2067 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS  TO covoiturage_user;


--
-- TOC entry 2065 (class 826 OID 16390)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES  TO covoiturage_user;


-- Completed on 2023-01-11 01:06:39

--
-- PostgreSQL database dump complete
--

