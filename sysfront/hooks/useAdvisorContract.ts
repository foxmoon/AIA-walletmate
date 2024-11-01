"use client";

import { useState } from 'react';
import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { waitForTransaction } from '@wagmi/core';
import { CONTRACTS } from '@/config/contracts';
import { parseEther } from 'viem';
import { useToast } from '@/hooks/use-toast';

export function useAdvisorContract() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [isUnlocking, setIsUnlocking] = useState(false);

  const { data: accessData, refetch: refetchAccess } = useContractRead({
    address: CONTRACTS.AIAdvisorDAO.address as `0x${string}`,
    abi: CONTRACTS.AIAdvisorDAO.abi,
    functionName: 'checkAccess',
    args: [address],
    enabled: !!address,
  });

  const checkAccess = async () => {
    if (!address) return false;
    const result = await refetchAccess();
    return Boolean(result.data);
  };

  const { writeAsync: approve } = useContractWrite({
    address: CONTRACTS.ADVToken.address as `0x${string}`,
    abi: CONTRACTS.ADVToken.abi,
    functionName: 'approve',
  });

  const { writeAsync: purchase } = useContractWrite({
    address: CONTRACTS.AIAdvisorDAO.address as `0x${string}`,
    abi: CONTRACTS.AIAdvisorDAO.abi,
    functionName: 'purchaseConsultation',
  });

  const unlockAdvisor = async () => {
    if (!address) {
      toast({
        title: "错误",
        description: "请先连接钱包",
        variant: "destructive",
      });
      return;
    }

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x528') {
      toast({
        title: "错误",
        description: "请切换到 AIA 测试网",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUnlocking(true);
      const fee = parseEther('100');

      const approveTx = await approve({
        args: [CONTRACTS.AIAdvisorDAO.address, fee],
      });
      
      // 等待approve交易被确认
      await waitForTransaction({ hash: approveTx.hash });
      
      const purchaseTx = await purchase();
      
      // 等待purchase交易被确认
      await waitForTransaction({ hash: purchaseTx.hash });

      setIsUnlocking(false);
      toast({
        title: "解锁成功",
        description: "您现在可以开始使用AI顾问服务了",
      });
      await refetchAccess();
    } catch (error) {
      console.error('Unlock failed:', error);
      setIsUnlocking(false);
      toast({
        title: "解锁失败",
        description: "请确保您有足够的ADV代币并已授权支付",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    unlockAdvisor,
    isUnlocking,
    checkAccess,
  };
} 