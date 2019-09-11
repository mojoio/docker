// @pushrocks scope
import * as lik from '@pushrocks/lik';
import * as smartlog from '@pushrocks/smartlog';
import * as smartnetwork from '@pushrocks/smartnetwork';
import * as smartpromise from '@pushrocks/smartpromise';
import * as smartrequest from '@pushrocks/smartrequest';
import * as smartversion from '@pushrocks/smartversion';

smartlog.defaultLogger.enableConsole();

export { lik, smartlog, smartnetwork, smartpromise, smartrequest, smartversion };

// third party
import * as rxjs from 'rxjs';

export { rxjs };
