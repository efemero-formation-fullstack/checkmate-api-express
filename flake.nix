{
  description = "Nix flake for postgresql environment.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    # outputs for each system (x86_64-linux, aarch64-darwin, etc…)
    flake-utils.lib.eachDefaultSystem (
      system:

      let
        pkgs = import nixpkgs { inherit system; };

        caseconv = pkgs.buildGoModule rec {
          pname = "caseconf";
          version = "0.0.4";
          src = pkgs.fetchFromGitHub {
            owner = "danielmesquitta";
            repo = "caseconv";
            rev = "v${version}";
            sha256 = "sha256-C377wOrMPNXdhrUhlY+3qLpGqIYVmLeLAw5RMoenlLw=";
          };
          vendorHash = "sha256-flxlQzP47UwSbGR6NLM8bVj1IW+xr9kcSd0zxKDh0Xk=";
          nativeCheckInputs = with pkgs; [ less ];
        };

        scripts = {
          startdb = ''
            pg_ctl -D .pg/data -l .pg/log/logs -o "-k `pwd`/.pg/run" -o "-p $PGPORT" start
          '';
          stopdb = ''
            pg_ctl -D .pg/data -l .pg/log/logs -o "-k `pwd`/.pg/run" -o "-p $PGPORT" stop
          '';
          initdb = ''
            mkdir -p .pg/{data,run,log}
            pg_ctl -D .pg/data  init
            echo "host    all        $PGUSER    127.0.0.1/32    scram-sha-256" > .pg/data/pg_hba.conf
            echo "host    all        $PGUSER    ::1/128         scram-sha-256" >> .pg/data/pg_hba.conf
            echo "local   all        all                        trust" >> .pg/data/pg_hba.conf
            echo "host    all        all        127.0.0.1/32    trust" >> .pg/data/pg_hba.conf
            echo "host    all        all        ::1/128         trust" >> .pg/data/pg_hba.conf
            pg_ctl -D .pg/data -l .pg/log/logs -o "-k `pwd`/.pg/run" -o "-p $PGPORT" start
            PGUSER="" psql -d postgres -c "CREATE ROLE $PGUSER NOSUPERUSER CREATEDB NOCREATEROLE INHERIT LOGIN NOREPLICATION NOBYPASSRLS;"
            PGUSER="" psql -d postgres -c "ALTER ROLE $PGUSER WITH PASSWORD '$PGPASSWORD';"
            PGUSER="" createdb  -O $PGUSER -e $PGDATABASE

            pg_ctl -D .pg/data -l .pg/log/logs -o "-k `pwd`/.pg/run" -o "-p $PGPORT" stop
          '';
        };
        toPackage = name: script: pkgs.writeShellScriptBin name script;
        nativeBuildInputs = with pkgs; [
          (lib.mapAttrsToList toPackage scripts)
          postgresql
          nodejs
          caseconv
          prek
          prettier
          jq
        ];
      in
      {

        devShells.default = pkgs.mkShell {

          inherit system nativeBuildInputs;

          shellHook = ''
            # Define your project name here
            export PROJECT_NAME="Checkmate"

            export SNAKE_PROJECT_NAME=`caseconv snake $PROJECT_NAME`
            export PGHOST="$PWD/.pg/run"
            export PGPORT=55432
            export PGDATABASE=$SNAKE_PROJECT_NAME
            export PGUSER=`echo $SNAKE_PROJECT_NAME | cut -d '_'  -f1`
            # change it if you want, but this is for dev purposes
            export PGPASSWORD=$PGUSER"_password"

            echo ""
            echo "🚀 Development environment for \"$PROJECT_NAME\" loaded!"
            echo ""
            echo "🐘 PostgreSQL DB:"
            echo "🐘   - to initialize the DB: 'initdb'"
            echo "🐘   - to start the DB: 'startdb'"
            echo "🐘   - to stop the DB: 'stopdb'"
            echo "🐘   - DBlogs in .pg/log/"
            echo ""
            echo -n "nodejs ⏣  "
            node --version  | head -1 | tail -1
          '';

        };
      }
    );
}
