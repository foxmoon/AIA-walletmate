"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/config/contracts';
import { useToast } from '@/hooks/use-toast';
import { AIA_NETWORK } from '@/lib/constants';

export function useEthersContract() {
  const [address, setAddress] = useState<string | null>(null);
  const [unlockingAdvisor, setUnlockingAdvisor] = useState<string | null>(null);
  const [unlockedAdvisors, setUnlockedAdvisors] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function init() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setAddress(accounts[0] || null);

          window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
            setAddress(newAccounts[0] || null);
          });
        } catch (error) {
          console.error('Failed to get accounts:', error);
        }
      }
    }

    init();

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const checkAccess = async (advisorType: string) => {
    if (!address || !window.ethereum) return false;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACTS.AIAdvisorDAO.address,
        CONTRACTS.AIAdvisorDAO.abi,
        provider
      );
      
      const hasAccess = await contract.checkAccess(address);
      if (hasAccess) {
        setUnlockedAdvisors(prev => [...new Set([...prev, advisorType])]);
      }
      return hasAccess;
    } catch (error) {
      console.error('Error checking access:', error);
      return false;
    }
  };

  const unlockAdvisor = async (advisorType: string) => {
    if (!address) {
      toast({
        title: "错误",
        description: "请先连接钱包",
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(`需要花费 10 ADV 来解锁${advisorType}，是否继续？`);
    if (!confirmed) return;

    try {
      setUnlockingAdvisor(advisorType);
      const fee = ethers.parseEther('100');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenContract = new ethers.Contract(
        CONTRACTS.ADVToken.address,
        CONTRACTS.ADVToken.abi,
        signer
      );

      const daoContract = new ethers.Contract(
        CONTRACTS.AIAdvisorDAO.address,
        CONTRACTS.AIAdvisorDAO.abi,
        signer
      );

      const balance = await tokenContract.balanceOf(address);
      if (balance < fee) {
        throw new Error("ADV代币余额不足");
      }

      const allowance = await tokenContract.allowance(address, CONTRACTS.AIAdvisorDAO.address);
      if (allowance < fee) {
        console.log('Approving tokens...');
        const approveTx = await tokenContract.approve(CONTRACTS.AIAdvisorDAO.address, fee);
        await approveTx.wait();
      }

      console.log('Purchasing consultation...');
      const purchaseTx = await daoContract.purchaseConsultation();
      
      console.log('Waiting for transaction...');
      const receipt = await purchaseTx.wait();
      console.log('Transaction receipt:', receipt);

      if (receipt.status === 0) {
        throw new Error("交易执行失败");
      }

      setUnlockedAdvisors(prev => [...new Set([...prev, advisorType])]);
      
      setUnlockingAdvisor(null);
      toast({
        title: "解锁成功",
        description: `${advisorType}已解锁，您现在可以开始使用顾问服务了`,
      });
    } catch (error) {
      console.error('Unlock failed:', error);
      setUnlockingAdvisor(null);
      toast({
        title: "解锁失败",
        description: error.message || "请确保您有足够的ADV代币并已授权支付",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    address,
    unlockAdvisor,
    unlockingAdvisor,
    checkAccess,
    unlockedAdvisors,
  };
} 