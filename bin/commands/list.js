'use strict';

const BaseCommand = require('./base').Command;
const inherits = require('util').inherits;

function Command(nameAndArgs) {
	BaseCommand.call(this, nameAndArgs);
}
inherits(Command, BaseCommand);

exports.Command = Command;

Command.prototype._execute = function _execute(params) {
	return Promise.resolve()
		.then(() => {
			return this.migrator.getMigrationNames(params.status);
		})
		.then((names) => {
			if (params.command.tag) {
				return this._filterMigrationNames({
					by: 'tag',
					names,
					tag: params.command.tag
				});
			} else {
				return names;
			}
		})
		.then((names) => {
			if (names.length) {
				this.logger.info(`${params.status} migrations:`);
			} else {
				this.logger.info(`there is no ${params.status} migrations`);
			}

			names.forEach((name) => {
				this.logger.info('\t', name);
			});
		});
};
