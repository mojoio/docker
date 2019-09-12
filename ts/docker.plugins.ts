// @pushrocks scope
import * as lik from '@pushrocks/lik';
import * as smartjson from '@pushrocks/smartjson';
import * as smartlog from '@pushrocks/smartlog';
import * as smartnetwork from '@pushrocks/smartnetwork';
import * as smartpromise from '@pushrocks/smartpromise';
import * as smartrequest from '@pushrocks/smartrequest';
import * as smartstring from '@pushrocks/smartstring'
import * as smartversion from '@pushrocks/smartversion';

smartlog.defaultLogger.enableConsole();

export { lik, smartjson, smartlog, smartnetwork, smartpromise, smartrequest, smartstring, smartversion };

// third party
import * as rxjs from 'rxjs';

export { rxjs };
