// @pushrocks scope
import * as lik from '@pushrocks/lik';
import * as smartlog from '@pushrocks/smartlog';
import * as smartpromise from '@pushrocks/smartpromise';
import * as smartrequest from '@pushrocks/smartrequest';

smartlog.defaultLogger.enableConsole();

export { lik, smartlog, smartpromise, smartrequest };

// third party
import * as rxjs from 'rxjs';

export { rxjs };
