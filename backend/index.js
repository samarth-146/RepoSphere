const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const Init = require('./controllers/init');
const Add = require('./controllers/add');
const Commit = require('./controllers/commit');
const Push = require('./controllers/push');
const server=require('./server');

yargs(hideBin(process.argv))
.command('start','Start the server',{},server)
    .command(
        'init <email> <repository>',
        'Initialize the repository',
        (yargs) => {
            yargs
                .positional('email', {
                    describe: 'User email',
                    type: 'string',
                })
                .positional('repository', {
                    describe: 'Repository name',
                    type: 'string',
                });
        },
        (argv) => {
            Init(argv.email, argv.repository);
        }
    )
    .command(
        'add <file>',
        'Add a file to staging',
        (yargs) => {
            yargs.positional('file', {
                describe: 'File to add',
                type: 'string',
            });
        },
        (argv) => {
            Add(argv.file);
        }
    )
    .command(
        'commit <message>',
        'Commit staged files',
        (yargs) => {
            yargs.positional('message', {
                describe: 'Commit message',
                type: 'string',
            });
        },
        (argv) => {
            Commit(argv.message);
        }
    )
    .command(
        'push',
        'Push committed files to AWS',
        {},
        () => {
            Push();
        }
    )
    .demandCommand(1)
    .parse();
