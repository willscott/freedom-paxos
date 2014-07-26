/** A Paxos Replica **/
var Replica = function(leaders, state) {
  this.state = state;
  this.leaders = leaders;
  this.slot_num = 1;
  this.proposals = {};
  this.decisions = {};
};

Replica.prototype.propose = function(p) {
  var proposed = false;
  this.decisions.forEach(function(decision) {
    if (decision.p === p) {
      proposed = true;
    }
  });
  if (!proposed) {
    var slot = 1;
    this.decisions.forEach(function(decision) {
      if (decision.s >= slot) {
        slot = decision.s + 1;
      }
    });
    this.proposals.forEach(function(proposal) {
      if (proposal.s >= slot) {
        slot = proposal.s + 1;
      }
    });
    this.proposals.push({s: slot, p: p});
    for (var i = 0; i < this.leaders.length; i++) {
      this.leaders[i].propose(slot, p);
    }
  }
};

// This implements handling of the 'Decision' command in paxos made moderately complex
Replica.prototype.learn = function(s, p) {
  this.decisions.push({s: s, p: p});
  this.decisions.forEach(function(decision) {
    if (decision.s != this.slot_num) {
      return;
    }
    this.proposals.forEach(function(proposal) {
      if (proposal.s == this.slot_num && proposal.p != decision.p) {
        this.propose(proposal.p);
      }
    }.bind(this));
    this.perform(decision.p);
  }.bind(this));
};

Replica.prototype.perform = function(p) {
  var exists = false;
  this.decisions.forEach(function(decision) {
    if (decision.s < this.slot_num && s.p == p) {
      exists = true;
    }
  }.bind(this));
  if (exists) {
    this.slot_num += 1;
  } else {
    //execute command p..u
    this.slot_num += 1;
    //fullfill client promise.
  }
};

/** A Paxos Acceptor */
var Acceptor = function() {
  this.ballot_num = 1;
  this.accepted = [];
};

Acceptor.prototype.prepare = function(n) {
  if (n > this.ballot_num) {
    this.ballot_num = n;
  }
  return {
    ballot_num: this.ballot_num,
    accepted: this.accepted
  };
};

Acceptor.prototype.accept = function(n, val) {
  if (n >= this.ballot_num) {
    this.ballot_num = n;
    this.accepted.push(val);
  }
  return {
    ballot_num: this.ballot_num
  };
};

freedom.paxos().providePromizes(Replica);
